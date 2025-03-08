from torch.nn import CrossEntropyLoss
from transformers import BertModel
import torch.nn as nn
import torch

class WHLA_BERT(nn.Module):
    def __init__(self, pretrained_model="bert-base-uncased", num_labels=2):
        super(WHLA_BERT, self).__init__()

        self.bert = BertModel.from_pretrained(pretrained_model, output_hidden_states=True)
        self.hidden_size = self.bert.config.hidden_size

        self.gates = nn.Parameter(torch.ones(4))
        self.fc = nn.Linear(self.hidden_size, num_labels)
        self.dropout = nn.Dropout(0.5)
        self.layer_norm = nn.LayerNorm(self.hidden_size)

    def forward(self, input_ids=None, attention_mask=None, labels=None, inputs_embeds=None, **kwargs):
        outputs = self.bert(
            input_ids=input_ids, 
            attention_mask=attention_mask, 
            inputs_embeds=inputs_embeds,
            return_dict=True
        )
        hidden_states = outputs.hidden_states

        L9 = hidden_states[-4]
        L10 = hidden_states[-3]
        L11 = hidden_states[-2]
        L12 = hidden_states[-1]

        weighted_sum = self.gates[0] * L9 + self.gates[1] * L10 + self.gates[2] * L11 + self.gates[3] * L12
        normalized_sum = self.layer_norm(weighted_sum)
        cls_representation = normalized_sum[:, 0, :]

        logits = self.fc(self.dropout(cls_representation))

        if labels is not None:
            loss_fct = CrossEntropyLoss()
            loss = loss_fct(logits.view(-1, logits.size(-1)), labels.view(-1))
            return {"loss": loss, "logits": logits}
        return type('ModelOutput', (), {'logits': logits})
    
    def get_input_embeddings(self):
        return self.bert.embeddings.word_embeddings
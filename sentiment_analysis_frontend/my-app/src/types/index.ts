export const TEST_DATA = [
    { text: "I love this product! It's amazing. It's amazing. It's amazing. It's amazing.", polarity: "Positive", confidence: 0.9920519590377808 },
    { text: "Absolutely terrible experience.", polarity: "Negative", confidence: 0.9858275651931763 },
    { text: "The movie was fantastic, I enjoyed every moment.", polarity: "Positive", confidence: 0.9916896820068359 },
    { text: "Worst customer service ever.", polarity: "Negative", confidence: 0.9856861233711243 },
    { text: "Such a pleasant surprise, exceeded my expectations!", polarity: "Positive", confidence: 0.9855992794036865 },
    { text: "I wouldn't recommend this to anyone.", polarity: "Negative", confidence: 0.8648756742477417 },
    { text: "Best decision I've ever made!", polarity: "Positive", confidence: 0.9875895977020264 },
    { text: "A complete waste of money.", polarity: "Negative", confidence: 0.9795213341712952 },
    { text: "I'm so happy with my purchase!", polarity: "Positive", confidence: 0.9915454983711243 },
    { text: "I regret buying this so much.", polarity: "Negative", confidence: 0.9858179688453674 },
    { text: "This is the best thing I've ever tried.", polarity: "Positive", confidence: 0.9674364924430847 },
    { text: "I can't believe how bad this was.", polarity: "Negative", confidence: 0.9821853041648865 },
    { text: "So much fun, I had a great time!", polarity: "Positive", confidence: 0.9916506409645081 },
    { text: "Disappointed beyond words.", polarity: "Negative", confidence: 0.985816240310669 },
    { text: "Excellent quality and great service!", polarity: "Positive", confidence: 0.9921122789382935 },
    { text: "I wish I never bought this.", polarity: "Negative", confidence: 0.9853251576423645 },
    { text: "Highly recommended for anyone!", polarity: "Positive", confidence: 0.9905354380607605 },
    { text: "Not worth it at all.", polarity: "Negative", confidence: 0.9846408367156982 },
    { text: "I had an amazing experience!", polarity: "Positive", confidence: 0.9914566874504089 },
    { text: "Never again, this was awful.", polarity: "Negative", confidence: 0.9841863512992859 },
]

export interface IPredictResponse {
    sentiment: string
    confidence: string
}

export interface IUploadCSVResponseItem {
    text: string
    sentiment: string
    confidence: string
}

export interface IToastState {
    id: string
    message: string
}
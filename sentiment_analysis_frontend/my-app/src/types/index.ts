export interface IPredictResponse {
    sentiment: string
    confidence: string
    word_importance: IWordImportance[]
}

export interface IPredictResults {
    sentiment: string
    confidence: string
    words: ITokenInfo[]
}

export interface IUploadCSVResponseItem {
    text: string
    sentiment: string
    confidence: string
}

export interface IUploadCSVResponse {
    texts: string[]
    labels: string[] | undefined
    predicted_classes: string[]
    confidence_scores: string[]
    metrics: IMetrics | undefined
    mode: string
    evaluation_mode: boolean
}

export interface IMetrics {
    accuracy: string
    f1: string
    recall: string
    precision: string
    loss: string
}

export interface IToastState {
    id: string
    message: string
}

export interface ITokenInfo {
    text: string;
    isSpace: boolean;
    contribution?: number;
    isHighlighted: boolean;
    originalIndex?: number;
}

export interface IWordImportance {
    word: string;
    contribution: number;
}
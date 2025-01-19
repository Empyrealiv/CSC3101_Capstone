export const TEST_DATA = [
    { text: 'I love React!', polarity: 'Positive' },
    { text: 'This is amazing!', polarity: 'Positive' },
    { text: 'Fantastic work!', polarity: 'Positive' },
    { text: 'I hate bugs!', polarity: 'Negative' },
    { text: 'This is frustrating.', polarity: 'Negative' },
    { text: 'I love React!', polarity: 'Positive' },
    { text: 'This is amazing!', polarity: 'Positive' },
    { text: 'Fantastic work!', polarity: 'Positive' },
    { text: 'I hate bugs!', polarity: 'Negative' },
    { text: 'This is frustrating.', polarity: 'Negative' },
]

export interface IMultiPredictResponseItem {
    text: string
    sentiment: string
}

export type IMultiPredictResponse = {
    resuls: IMultiPredictResponseItem[]
}
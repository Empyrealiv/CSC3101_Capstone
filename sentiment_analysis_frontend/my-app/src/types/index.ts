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

export interface IUploadCSVResponseItem {
    text: string
    sentiment: string
}

export type IUploadCSVResponse = {
    resuls: IUploadCSVResponseItem[]
}

export interface IToastState {
    id: string
    message: string
}
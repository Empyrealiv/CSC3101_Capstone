export default function SentimentInputField({ value, onChange }) {
    const textAreaStyle = {
      width: '20vw',
      height: '20vh',
      padding: '5px',
      margin: '20px 0 0 0',
      fontSize: '16px',
      lineHeight: '1.5',
      textAlign: 'left',
      verticalAlign: 'top',
      border: '1px solid #ccc',
      borderRadius: '4px',
      resize: 'none'
    };
  
    return <textarea
    value={value}
    onChange={onChange}
    style={textAreaStyle}
    placeholder="Enter text here">
    </textarea>;
}
  
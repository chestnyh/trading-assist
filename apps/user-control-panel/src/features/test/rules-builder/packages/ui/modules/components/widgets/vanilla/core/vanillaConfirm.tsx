export default ({onOk, okText, cancelText, title}: {onOk: () => void, okText: string, cancelText: string, title: string}) => {
  if (confirm(title)) {
    onOk();
  }
};

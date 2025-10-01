import React, {Component} from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

interface Props {
  readOnly?: boolean;
  json: any;
  onChangeJSON?: (json: any) => void;
}

export default class JSONEditorDemo extends Component<Props> {
  private container!: HTMLElement;
  private jsoneditor: any = null;
  
  componentDidMount() {
    const options = {
      mode: 'code' as const,
      onChangeJSON: this.props.onChangeJSON,
      onError: (error: any) => {
        console.error('JSONEditor error:', error);
      },
      onModeChange: (mode: string) => {
        console.log('Mode changed to:', mode);
      },
      onChangeText: this.props.readOnly ?  (...args: any[]) => {
        // TODO: Don't like this to make a json unchangable. Need to find another way.
        this.jsoneditor.set(this.props.json);
      } : undefined
    };

    this.jsoneditor = new JSONEditor(this.container, options);
    this.jsoneditor.set(this.props.json);
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.json !== this.props.json) {
      this.jsoneditor.update(this.props.json);
    }
  }

  render() {
    return (
      <div 
        className="jsoneditor-react-container" 
        style={{
          height: '400px',
          minHeight: '300px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px'
        }} 
        ref={elem => this.container = elem!} 
      />
    );
  }
}
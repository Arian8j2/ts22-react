import {Component} from 'react';

class Content extends Component{
  constructor(props: any){
    super(props); 
  }

  render(){
    return (
      <h1 className="animate__animated animate__zoomIn">Hello</h1>
    );
  }
};

export default Content;
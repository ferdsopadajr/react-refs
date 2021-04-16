import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

// Class-based component using ref
class AppCreateRef extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  handleClick = () => {
    this.textInput.current.focus();
  };
  render = () => (
    <div>
      <input type="text" ref={this.textInput} />
      <button onClick={this.handleClick}>Click!</button>
    </div>
  );
}

// Functional component using ref
const AppUseRef = () => {
  const textInput = React.useRef();
  const handleClick = () => {
    textInput.current.select();
    document.execCommand("copy");
  };
  return (
    <div>
      <input
        type="text"
        ref={textInput}
        defaultValue="this will get selected"
      />
      <button onClick={handleClick}>Copy!</button>
    </div>
  );
};

// Callback ref implementation
// Use callback ref in case you want to run some code when React attaches or
// detaches a ref to a DOM node alternative to re-render
const AppCallbackRef = () => {
  let textInput = React.useRef(true);
  const [display, setDisplay] = React.useState(true);
  const handleRef = (el) => {
    textInput = el;
  };
  const handleClick = () => {
    setDisplay(!display);
    alert(textInput.value);
  };
  return (
    <div>
      <input type="text" ref={handleRef} defaultValue="this will alert" />
      <button onClick={handleClick}>Alert & Unmount!</button>
      {display && <AppUseEffect />}
    </div>
  );
};

// Use of useEffect's clean-up function when component is unmounted
// To reproduce `Warning: Can’t perform a React state update on an unmounted
// component.`, delay setState inside the unmounted component longer than
// the unmounting time
const AppUseEffect = () => {
  const mounted = React.useRef(true);
  React.useEffect(() => {
    console.log("mounted", mounted.current);
    return () => {
      mounted.current = false;
      console.log("unmounted");
    };
  });
  const [copy, setCopy] = React.useState("copy1");
  const handleClick = () => {
    setTimeout(() => setCopy(`coco${copy}`), 3000);
    mounted.current.select();
    document.execCommand("copy");
  };
  return (
    <div>
      <input type="text" ref={mounted} defaultValue="copy use ref" />
      <button onClick={handleClick}>Copy!</button>
    </div>
  );
};

// Usage of forwarding ref
// Ref forwarding is a technique for automatically passing a ref through a
// component to one of its children, because React doesn't assign `current` with
// a non-DOM element
const InputComponent = React.forwardRef((props, ref) => {
  console.log(props);
  console.log(ref);
  return <input ref={ref} {...props} />;
});
const AppForwardingRef = () => {
  const textInput = React.useRef(null);
  const handleClick = () => {
    console.log(textInput.current);
    textInput.current.select();
    document.execCommand("copy");
  };
  return (
    <div>
      <InputComponent
        type="text"
        ref={textInput}
        defaultValue="this will get selected"
      />
      <button onClick={handleClick}>Copy!</button>
    </div>
  );
};

// Usage of useImperativeHandle and forwarding ref
// Expose limited DOM methods (such as select, focus, click, etc.) to callers
const TextInputComponent = React.forwardRef((props, ref) => {
  const childRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    select: () => {
      childRef.current.select();
      console.log("Special select is called");
    },
    log: () => console.log("log is invoked inside TextInputComponent")
  }));
  return <input ref={childRef} {...props} />;
});
const AppUseImperativeHandle = () => {
  const textInput = React.useRef(null);
  const handleClick = () => {
    console.log("current", textInput.current); // current object's value is no longer an input element, instead, an object containing available methods
    textInput.current.log();
    textInput.current.select();
    document.execCommand("copy");
  };
  return (
    <div>
      <TextInputComponent
        type="text"
        ref={textInput}
        defaultValue="highlight and copy me"
      />
      <button onClick={handleClick}>Copy!</button>
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <AppCreateRef />
    <AppUseRef />
    <AppCallbackRef />
    <AppForwardingRef />
    <AppUseImperativeHandle />
  </StrictMode>,
  document.getElementById("root")
);

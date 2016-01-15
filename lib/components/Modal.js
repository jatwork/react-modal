var React = require('react');
var ReactDOM = require('react-dom');
var ExecutionEnvironment = require('exenv');
var ModalPortal = React.createFactory(require('./ModalPortal'));
var ariaAppHider = require('../helpers/ariaAppHider');
var elementClass = require('element-class');
var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};

var Modal = module.exports = React.createClass({

  displayName: 'Modal',
  statics: {
    __openCount: 0,
    setAppElement: ariaAppHider.setElement,
    injectCSS: function() {
      "production" !== process.env.NODE_ENV
        && console.warn('React-Modal: injectCSS has been deprecated ' +
                        'and no longer has any effect. It will be removed in a later version');
    }
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    appElement: React.PropTypes.instanceOf(SafeHTMLElement),
    onRequestClose: React.PropTypes.func,
    closeTimeoutMS: React.PropTypes.number,
    ariaHideApp: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
      ariaHideApp: true,
      closeTimeoutMS: 0
    };
  },

  componentDidMount: function() {
    this.node = document.createElement('div');
    this.node.className = 'ReactModalPortal';
    document.body.appendChild(this.node);
    if (this.props.isOpen) {
      this.addOpenClassName();
    }
    this.renderPortal(this.props);
  },

  componentWillReceiveProps: function(newProps) {
    if (!this.props.isOpen && newProps.isOpen) {
      this.addOpenClassName();
    } else if (this.props.isOpen && !newProps.isOpen) {
      this.removeOpenClassName();
    }
    this.renderPortal(newProps);
  },

  componentWillUnmount: function() {
    if (this.props.isOpen) {
      this.removeOpenClassName();
    }
    ReactDOM.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  },

  addOpenClassName: function() {
    Modal.__openCount = Modal.__openCount + 1;
    if (Modal.__openCount === 1) {
      elementClass(document.body).add('ReactModal__Body--open');
    }
  },

  removeOpenClassName: function() {
    Modal.__openCount = Modal.__openCount - 1;
    if (Modal.__openCount === 0) {
      elementClass(document.body).remove('ReactModal__Body--open');
    }
  },

  renderPortal: function(props) {
    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    sanitizeProps(props);
    this.portal = renderSubtreeIntoContainer(this, ModalPortal(props), this.node);
  },

  render: function () {
    return React.DOM.noscript();
  }
});

function sanitizeProps(props) {
  delete props.ref;
}

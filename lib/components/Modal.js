var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
var ModalPortal = React.createFactory(require('./ModalPortal'));
var ariaAppHider = require('../helpers/ariaAppHider');
var injectCSS = require('../helpers/injectCSS');
var elementClass = require('element-class');

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};

var Modal = module.exports = React.createClass({

  displayName: 'Modal',

  statics: {
    __openCount: 0,
    setAppElement: ariaAppHider.setElement,
    injectCSS: injectCSS
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func,
    appElement: React.PropTypes.instanceOf(SafeHTMLElement),
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
    React.unmountComponentAtNode(this.node);
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
    if (this.portal)
      this.portal.setProps(props);
    else
      this.portal = React.render(ModalPortal(props), this.node);
  },

  render: function () {
    return null;
  }
});

function sanitizeProps(props) {
  delete props.ref;
}

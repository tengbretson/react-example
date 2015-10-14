import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import autobind from 'autobind';
import './style/app.scss';

const newParty = {
  formlets: {
    personName: {
      formlets: {},
      fields: {
        firstName: {
          value: '',
          label: 'First name',
          name: 'firstName',
          validators: []
        },
        middleName: {
          value: '',
          label: 'Middle name',
          name: 'middleName',
          validators: []
        },
        lastName: {
          value: '',
          label: 'Last name',
          name: 'lastName',
          validators: []
        },
        suffix: {
          value: '',
          label: 'Suffix',
          name: 'suffix',
          validators: []
        }
      }
    }
  },
  fields: {
    favoriteColor: {
      name: 'favoriteColor',
      label: 'Favorite color',
      value: '',
      validators: []
    }
  }
}


class LabeledTextInput extends Component {
  static defaultProps = {
    validators: []
  }
  static propTypes = {
    validators: PropTypes.arrayOf(PropTypes.func).isRequired
  }
  constructor(props) {
    super(props);
    this.state = {error: null};
  }
  @autobind async handleChange() {
    const {validators} = this.props;
    const value = new Promise(resolve => resolve(this.refs.input.value));
    try {
      await * validators.map(validator => value.then(validator));
      this.setState({error: null});
    } catch (error) {
      this.setState({error});
    }
  }
  render() {
    const {error} = this.state;
    const {value, label, name} = this.props;
    return <div className={error ? 'error' : null}>
      <label>
        <span>{label}</span>
        <input ref='input' type='text' placeholder={label}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          {...{value, name}}
        />
      </label>
      <small className='error'>{error ? error.message : ''}</small>
    </div>;
  }
}

const PersonName = props => {
  const {firstName, middleName, lastName, suffix} = props.fields;
  return <div className='row'>
    <div className='column medium-3'>
      <LabeledTextInput {...firstName} />
    </div>
    <div className='column medium-3'>
      <LabeledTextInput {...middleName} />
    </div>
    <div className='column medium-4'>
      <LabeledTextInput {...lastName} />
    </div>
    <div className='column medium-2'>
      <LabeledTextInput {...suffix} />
    </div>
  </div>;
}

const NewParty = props => {
  const {favoriteColor} = props.fields;
  const {personName} = props.formlets;
  return <section className='column'>
    <fieldset>
      <legend>New party</legend>
      <div className='row'>
        <div className='column medium-4'>
          <LabeledTextInput {...favoriteColor} />
        </div>
      </div>
      <PersonName {...personName} />
    </fieldset>
  </section>;
}

class App extends Component {
  render() {
    return <form data-abide>
      <NewParty {...newParty} />
    </form>;
  }
}

render(<App />, document.querySelector('main'));

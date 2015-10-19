import React, { Component, PropTypes } from 'react';
import { createStore, combineReducers } from 'redux';
import { connectReduxForm, reducer as formReducer } from 'redux-form';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import classNames from 'classnames';
import autobind from 'autobind';
import './style/app.scss';

/*
  this data can be writted to the global object by a script rendered by
  the server
  ------------------------------------------------------------------------------
*/
window.__init_data = {
  initialValues: {
    firstName: 'STORED_FIRST_NAME'
  },
  config: {
    form: 'new-party',
    fields: ['firstName', 'middleName', 'lastName', 'suffix'],
    asyncValidate(data) {
      console.log('async', JSON.stringify(data));
      return new Promise(resolve => resolve({
        suffix: 'Suffix is too suffixy'
      }));
    }
  },
  submitCallback(data) {
    console.log('submit', data);
  }
};
/*
  ------------------------------------------------------------------------------
*/

const reducer = combineReducers({form: formReducer});
const store = createStore(reducer);

const { config, initialValues, submitCallback } = window.__init_data;

@connectReduxForm(config)
class NewPartyForm extends Component {
  static propTypes = {
    fields: PropTypes.shape({
      firstName: PropTypes.object.isRequired,
      middleName: PropTypes.object.isRequired,
      lastName: PropTypes.object.isRequired,
      suffix: PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired
  }
  render() {
    const {
      handleSubmit,
      fields: { firstName, middleName, lastName, suffix }
    } = this.props;
    return <form onSubmit={handleSubmit(submitCallback)} data-abide>
      <fieldset>
        <legend>New party</legend>
        <div className='row'>
          <div className={classNames('column','medium-3', {error: firstName.error})}>
            <label>
              <span>First name</span>
              <input type='text' placeholder='First name' {...firstName} />
              <small className='error'>{firstName.error}</small>
            </label>
          </div>
          <div className={classNames('column','medium-3', {error: middleName.error})}>
            <label>
              <span>Middle name</span>
              <input type='text' placeholder='Middle name' {...middleName} />
              <small className='error'>{middleName.error}</small>
            </label>
          </div>
          <div className={classNames('column','medium-4', {error: lastName.error})}>
            <label>
              <span>Last name</span>
              <input type='text' placeholder='Last name' {...lastName} />
              <small className='error'>{lastName.error}</small>
            </label>
          </div>
          <div className={classNames('column','medium-2', {error: suffix.error})}>
            <label>
              <span>Suffix</span>
              <input type='text' placeholder='suffix' {...suffix} />
              <small className='error'>{suffix.error}</small>
            </label>
          </div>
        </div>
        <button className='tiny button' type='submit'>Submit</button>
      </fieldset>
    </form>
  }
}

render(<NewPartyForm {...{initialValues, store}} />, document.querySelector('main'));

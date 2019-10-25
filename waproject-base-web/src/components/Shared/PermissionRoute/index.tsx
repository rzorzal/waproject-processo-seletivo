import { enRoles } from 'interfaces/models/user';
import React, { Fragment } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import RxOp from 'rxjs-operators';
import authService from 'services/auth';

import PermissionHide from '../PermissionHide';

interface IProps extends RouteProps {
  role?: enRoles;
}

export default class PermissionRoute extends Route<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { ...(this.state || {}) };
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();

    authService
      .isAuthenticated()
      .pipe(
        RxOp.logError(),
        RxOp.bindComponent(this),
        RxOp.tap(isAuthenticated => {
          if (isAuthenticated) return;
          authService.openLogin();
        })
      )
      .subscribe(isAuthenticated => {
        this.setState({ isAuthenticated });
      });
  }

  render() {
    const { isAuthenticated } = this.state;

    if (!isAuthenticated) {
      return null;
    }

    return (
      <Fragment>
        <PermissionHide role={this.props.role}>{super.render()}</PermissionHide>

        <PermissionHide inverse role={this.props.role}>
          <p>Não encontrado</p>
        </PermissionHide>
      </Fragment>
    );
  }
}

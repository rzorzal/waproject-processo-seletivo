import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IStateList, ListComponent, TableCellSortable } from 'components/Abstract/List';
import Toolbar from 'components/Layout/Toolbar';
import TableWrapper from 'components/Shared/TableWrapper';
import {IOrder} from 'interfaces/models/order';
import { IPaginationParams } from 'interfaces/pagination';
import AccountPlusIcon from 'mdi-react/AccountPlusIcon';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment } from 'react';
import * as RxOp from 'rxjs-operators';
import orderService from 'services/order';

import ListItem from './ListItem';

interface IState extends IStateList<IOrder> {
  current?: IOrder;
  formOpened?: boolean;
}

export default class OrderListPage extends ListComponent<{}, IState> {
  actions = [
    {
      icon: AccountPlusIcon,
    }
  ];

  constructor(props: {}) {
    super(props, 'description');
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = (params: Partial<IPaginationParams> = {}) => {
    this.setState({ loading: true, error: null });

    orderService
      .list(this.mergeParams(params))
      .pipe(
        RxOp.logError(),
        RxOp.bindComponent(this)
      )
      .subscribe(items => this.setPaginatedData(items), error => this.setError(error));
  };


  handleRefresh = () => this.loadData();

  render() {
    const { items, loading, } = this.state;

    return (
      <Fragment>
        <Toolbar title='Pedidos' />

        <Card>
          {this.renderLoader()}

          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6} lg={4}>
                {this.renderSearch()}
              </Grid>
            </Grid>
          </CardContent>

          <TableWrapper minWidth={500}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellSortable {...this.sortableProps} column='description'>
                    Descrição
                  </TableCellSortable>
                  <TableCellSortable {...this.sortableProps} column='count'>
                    Quantidade
                  </TableCellSortable>
                  <TableCellSortable {...this.sortableProps} column='value'>
                    Valor
                  </TableCellSortable>
                  <TableCell>
                    <IconButton disabled={loading} onClick={this.handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.renderEmptyAndErrorMessages(3)}
                {items.map(order => (
                  <ListItem key={order.id} order={order} onDeleteComplete={this.loadData} />
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          {this.renderTablePagination()}
        </Card>
      </Fragment>
    );
  }
}

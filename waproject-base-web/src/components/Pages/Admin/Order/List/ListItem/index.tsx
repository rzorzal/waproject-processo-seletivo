import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ListItemComponent, { IStateListItem } from 'components/Abstract/ListItem';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import Toast from 'components/Shared/Toast';
import {IOrder} from 'interfaces/models/order';
import DeleteIcon from 'mdi-react/DeleteIcon';
import * as React from 'react';
import * as RxOp from 'rxjs-operators';
import orderService from 'services/order';

interface IState extends IStateListItem {
  deleted?: boolean;
}

interface IProps {
  order: IOrder;
  onDeleteComplete: () => void;
}

const formatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'BRL',
});

export default class ListItem extends ListItemComponent<IProps, IState> {
  private readonly options: IOption[];

  constructor(props: IProps) {
    super(props);
    this.options = [
      {
        text: 'Excluir',
        icon: DeleteIcon,
        handler: this.handleDelete
      }
    ];
  }

  handleDelete = async () => {
    const { order, onDeleteComplete } = this.props;

    const ok = await Alert.confirm(`Deseja excluir o pedido ${order.description}?`);
    if (!ok) return;

    this.setState({ loading: true });

    orderService
      .delete(order.id)
      .pipe(
        RxOp.logError(),
        RxOp.bindComponent(this)
      )
      .subscribe(
        () => {
          Toast.show(`${order.description} foi removido`);
          this.setState({ loading: false, deleted: true });
          onDeleteComplete();
        },
        error => {
          this.setState({ loading: false, error });
        }
      );
  };

  render(): JSX.Element {
    const { deleted } = this.state;
    const { order } = this.props;

    if (deleted) {
      return null;
    }

    return (
      <TableRow>
        <TableCell>{order.description}</TableCell>
        <TableCell>{order.count}</TableCell>
        <TableCell>{formatter.format(parseFloat(order.value))}</TableCell>
        <TableCell>{this.renderSideMenu(this.options)}</TableCell>
      </TableRow>
    );
  }
}

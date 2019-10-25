import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Container, Button, Icon } from 'native-base';
import BaseComponent from '~/components/Shared/Abstract/Base';
import { classes, variablesTheme } from '~/assets/theme';
import { tap, filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { logError } from '~/helpers/rxjs-operators/logError';
import OrderForm from './components/Form';

import { NavigaitonOptions } from '~/hooks/useNavigation';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { loader } from '~/helpers/rxjs-operators/loader';

import { IOrder } from '~/interfaces/models/order';
import Toast from '~/facades/toast';
import orderService from '~/services/order';

export default class OrderScreen extends BaseComponent{
  
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Criar Pedido',
      headerLeft: () => (
        <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
          <Icon name='menu' />
        </Button>
      ),
    };
  };

  constructor(props: any){
    super(props);
    
    this.submitOrder = this.submitOrder.bind(this);
  }
	
  submitOrder(model: IOrder){
     console.log(model);
     of(model).pipe(
	switchMap((m) => orderService.save(m).pipe(loader())),
        logError(),
        bindComponent(this)
     ).subscribe(
        () => {
          this.navigateBack();
        },
        err => Toast.showError(err)
      );
  }


  public render(){
    return (<Container>
	<View style={styles.container}>
		<Text style={styles.title}>Criar Pedido</Text>
      		<OrderForm onSubmit={this.submitOrder} />
	</View>
    </Container>);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30
  }
});

import FieldText from '@react-form-fields/native-base/Text';
import ValidationContext from '@react-form-fields/native-base/ValidationContext';
import { Button, Card, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { filter } from 'rxjs/operators';
import { variablesTheme } from '~/assets/theme';
import FormComponent, { IStateForm } from '~/components/Shared/Abstract/Form';
import Toast from '~/facades/toast';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { logError } from '~/helpers/rxjs-operators/logError';
import { IOrder } from '~/interfaces/models/order';

interface IState extends IStateForm<IOrder> {}

interface IProps {
  onSubmit: (model: IState) => void;
}

export default class LoginFormComponent extends FormComponent<IProps, IState> {
  inputStyles = {
    container: styles.inputContainer
  };

  handleSubmit = () => {
    this.isFormValid()
      .pipe(
        filter(valid => valid),
        logError(),
        bindComponent(this)
      )
      .subscribe(
        () => {
          this.props.onSubmit(this.state.model as any);
        },
        err => Toast.showError(err)
      );
  };

  render() {
    const { model } = this.state;

    return (
      <ValidationContext ref={this.bindValidationContext}>
        <Card style={styles.card}>
          <FieldText
            placeholder='Descrição'
            validation='required'
            value={model.description}
            flowIndex={1}
            onChange={this.updateModel((v, m) => (m.description = v))}
          />

          <FieldText
            placeholder='Quantidade'
	    keyboardType='number-pad'
            validation='required'
            value={model.count}
            flowIndex={2}
            onChange={this.updateModel((v, m) => (m.count = v))}
          />

	<FieldText
            placeholder='Valor'
            validation='required'
            keyboardType='number-pad'
            value={model.value}
            flowIndex={3}
            mask={"money"}
            onChange={this.updateModel((v, m) => (m.value = v))}
          />

          <Button style={styles.button} full onPress={this.handleSubmit}>
            <Text>Salvar</Text>
          </Button>
        </Card>
      </ValidationContext>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
    padding: 20,
    paddingRight: 30,
    marginTop: 20,
    width: variablesTheme.deviceWidth - 60,
    justifyContent: 'flex-start'
  },
  inputContainer: {
    paddingTop: 0
  },
  button: {
    borderRadius: variablesTheme.borderRadiusBase,
    marginTop: 10
  }
});

import { IOrder } from 'interfaces/models/order';
import * as joi from 'joi';
import * as lodash from 'lodash';

import { validate } from './profile';

describe('app/validators/order', () => {
  const data: Partial<IOrder> = {
    id: 1,
    description: 'X-Tudo',
    count: 20,
    value: '20.00'
  };

  it('should return valid for a minimun object', async () => {
    const model = { ...data };
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when id is less than 1', async () => {
    const model = { ...data};
    model.id = 0;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('id');
    expect(err.message[0].type).toEqual('number.min');
  });


  it('should return invalid when description is empty', async () => {
    const model = { ...data };
    delete model.description;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('description');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when count is empty', async () => {
    const model = { ...data };
    delete model.count;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('count');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when value is empty', async () => {
    const model = { ...data };
    delete model.value;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('value');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when description length is greather than 250', async () => {
    const model = { ...data };
    model.description = new Array(251).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message.some(m => m.path == 'description' && m.type == 'string.max')).toBeTrue();
  });

  it('should return invalid when description value is greather than 20', async () => {
    const model = { ...data };
    model.description = new Array(21).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message.some(m => m.path == 'value' && m.type == 'string.max')).toBeTrue();
  });

});
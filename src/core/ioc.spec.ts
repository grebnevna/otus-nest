import { IoC } from './ioc';
import { Command } from '../models/command';
import { InitCommand } from './commands/ioc/init-command';

const initCommand = new InitCommand();
const testFunction = (value: string) => value;

beforeEach(() => {
	IoC.currentScope = IoC.rootScope;
	initCommand.execute();
})
 
test('root scope заполняется стратегиями после выполнения InitCommand', () => {
	expect(IoC.rootScope.size).toBe(5);
})

test('попытка разрешить зарегистированную зависимость не приведет к исключению', () => {

  IoC.resolve<Command>('IoC.Register', 'TestFunction', (...args: any[]) => testFunction(args[0])).execute();

	const registeredDependency = () => IoC.resolve<(value: string) => string>('TestFunction', 'Hello world!');

	expect(registeredDependency()).toBe('Hello world!');
})

test('попытка разрешить незарегистированную зависимость приведет к исключению', () => {
	const notRegisteredDependency = () => IoC.resolve<Command>('NotRegisteredDependency').execute;

	expect(notRegisteredDependency).toThrow(Error('No dependency found'));
})

test('по умолчанию текущим скоупом является рутовый', () => {
	expect(IoC.currentScope).toBe(IoC.rootScope);
})

test('если создать новый скоуп без передачи аргументов, то родительский скоуп будет RootScope', () => {
  const newScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create');
  IoC.currentScope = newScope;

	const parentScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Parent');

	expect(parentScope).toBe(IoC.rootScope);
})

test('у RootScope нет родительского скоупа', () => {
	const parentScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Parent');
	expect(parentScope).toBeNull();
})

test('если создать скоуп, передав аргумент, то этот аргумент будет ссылкой на родительски скоуп', () => {
  const testScope1 = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create');
	const testScope2 = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create', testScope1);

  IoC.currentScope = testScope2;

	const testScope2ParentScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Parent');

	expect(testScope2ParentScope).toBe(testScope1);
})

test('если создать скоуп и зарегистрировать в нем зависимость, то эту зависимость возможно разрешить', () => {
	const testScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create');
	IoC.currentScope = testScope;

	IoC.resolve<Command>('IoC.Register', 'TestFunction', (...args: any[]) => testFunction(args[0])).execute();
	const registeredDependency = () => IoC.resolve<(value: string) => string>('TestFunction', 'Hello world!');

	expect(registeredDependency()).toBe('Hello world!');
})

test('если создать скоуп и не зарегистрировать в нем зависимость, то при разрешении зависимостей, не найдя в этом скоупе, зависимость будет искаться в родительских', () => {
	IoC.resolve<Command>('IoC.Register', 'AnotherTestFunction', (...args: any[]) => testFunction(args[0])).execute();

	const testScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create');
	IoC.currentScope = testScope;

	const dependency = () => IoC.resolve<(value: string) => string>('AnotherTestFunction', 'Hello world!');

	expect(dependency()).toBe('Hello world!');
})
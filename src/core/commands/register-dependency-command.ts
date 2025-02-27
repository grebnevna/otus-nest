import { IoC } from "src/core/ioc";
import { Command } from "src/models/command";

export class RegisterDependencyCommand implements Command {

	constructor(
		private dependencyName: string,
		private depednecyResolverStrategy: (...args: any[]) => any
	){}

	execute(): void {
		const currentScope = IoC.resolve<Map<string, (...args: any) => any>>('IoC.Scope.Current');
    currentScope.set(this.dependencyName, this.depednecyResolverStrategy);
	}
}
import { IoC } from "src/core/ioc";
import { Command } from "src/models/command";
import { RegisterDependencyCommand } from "./register-dependency-command";

export class InitCommand implements Command {
	execute(): void {
		IoC.rootScope.set(
			"IoC.Register",
			(...args: any[]) => new RegisterDependencyCommand(
				args[0] as string,
				args[1] as (...args: any[]) => object)
		);

		IoC.rootScope.set(
			"IoC.Scope.Parent",
			() => null
		);

		IoC.rootScope.set(
			"IoC.Scope.Current",
			() => IoC.currentScope || IoC.rootScope
		);
			
		IoC.rootScope.set(
			"IoC.Scope.Create.Empty",
			() => new Map()
		);

		IoC.rootScope.set(
			"IoC.Scope.Create",
			(...args: any[]) => {
				const creatingScope = IoC.resolve<Map<string, (...args: any[]) => object>>("IoC.Scope.Create.Empty");

				if (args.length) {
					const parentScope = args[0];
					creatingScope.set("IoC.Scope.Parent", () => parentScope);
				} else {
					const parentScope = IoC.resolve<any>("IoC.Scope.Current");
					creatingScope.set("IoC.Scope.Parent", () => parentScope);
				}

				return creatingScope;
			}
		)
	}
}
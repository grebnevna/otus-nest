export class IoC {

	public static rootScope = new Map();
	public static currentScope: Map<string, (...args: any[]) => any> | null = IoC.rootScope;

	static resolve<T>(dependencyName: string, ...args: any[]): T {
		let _current = this.currentScope;
		let dependency: T;

		while (_current) {
			if (_current.get(dependencyName)) {
				dependency = _current.get(dependencyName)(...args);
				_current = null;
			} else {
				_current = _current.get('IoC.Scope.Parent')()
			}
		}

		if (dependency === undefined) {
			throw new Error('No dependency found');
		}

		return dependency
	}
}
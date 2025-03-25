export type PerformCommandRequestDto = {
	gameId: string;
	gameObjectName: string;
	operationName: string;
	params: object;
}
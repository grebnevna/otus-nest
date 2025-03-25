export type GameRegistrationRequestDto = {
	players: {
		name: string,
		initialParameters: { [key: string]: any }
	}[]
	config: { [key: string]: any }
}
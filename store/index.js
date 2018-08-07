export const state = () => ({
	isMobile: false,
	snackBar: false,
	snackBarText: ''
});

export const mutations = {
	setDevice(state, isMobile) {
		state.isMobile = isMobile;
	},
	snackBarOpen(state, snackBarText) {
		state.snackBar = true;
		state.snackBarText = snackBarText;
	},
	snackBarClose(state) {
		state.snackBar = false;
		state.snackBarText = '';
	}
};

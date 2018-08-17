export const state = () => ({
	isMobile: false,
	sideBar: true,
	snackBar: false,
	snackBarText: '',
	remember: true,
	loading: 0,
	me: null
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
	},
	setMe(state, me) {
		state.me = me;
	},
	setRemember(state, remember) {
		state.remember = remember;
	},
	load(state) {
		state.loading++;
	},
	dump(state) {
		state.loading--;
	},
	setSideBar(state, status) {
		state.sideBar = status;
	}
};

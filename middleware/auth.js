import gql from 'graphql-tag';

export default ({ app, store, redirect, route }) => {
	const token = app.$apolloHelpers.getToken();
	const isLoginPage = route.name === 'login';
	// 没有token直接导航至登录页面
	if (!token) {
		if (!isLoginPage) {
			store.commit('snackBarOpen', '需要登录以验证权限');
			redirect({ path: '/login', query: { next: route.path } });
		}
	} else {
		// 无用户时显示加载动画
		let load = false;
		if (!store.state.me || isLoginPage) {
			store.commit('load');
			load = true;
		}
		const client = app.apolloProvider.defaultClient;
		const query = gql`
			{
				me {
					id
					name
					createdAt
				}
			}
		`;
		client
			.query({ query })
			.then(({ data: { me } }) => {
				store.commit('setMe', me);
				if (isLoginPage) {
					redirect('/');
				}
			})
			// token失效
			.catch((e) => {
				store.commit('setMe', null);
				app.$apolloHelpers.onLogout();
				store.commit('snackBarOpen', '令牌已失效, 请重新登录');
				redirect({ path: '/login', query: { next: route.path } });
			})
			.finally(() => {
				if (load) {
					store.commit('dump');
				}
			});
	}
};

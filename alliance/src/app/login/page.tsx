import {AuthPage} from "@components/auth-page";
import {authProviderServer} from "@providers/auth-provider";
import {redirect} from "next/navigation";

export default async function Login() {

    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || "/");
    }

    return <AuthPage type="login" registerLink={false} forgotPasswordLink={false} rememberMe={false}/>;
}

async function getData() {
    const {authenticated, redirectTo, error} = await authProviderServer.check();

    return {
        authenticated,
        redirectTo,
        error,
    };
}

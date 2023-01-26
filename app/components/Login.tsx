import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { useSupabase } from "~/hooks/useSupabase";
import { useState } from "react";
import styles from "~/styles/login.css";
import { useOutletContext } from "@remix-run/react";
import { Database } from "~/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import image from "../../public/user.svg"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type TypedSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
	supabase: TypedSupabaseClient;
};

export function Login() {
	const supabase = useSupabase();
	const { user } = useOutletContext<any>();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.log("Error al cerrar sesión", error);
	};

	const handleLogin = async () => {
		const user = await supabase.auth.signInWithOAuth({
			provider: "github",
		});

		if (user.error) console.log("Error al iniciar sesión", user.error);
	};
	
	return (
		<>
			<div className="profile">
				<img
					width={"40px"}
					height={"40px"}
					src={user?.user_metadata?.avatar_url || image}
					alt="user avatar"
				/>
        <p>
          {user?.user_metadata?.name}
        </p>
			</div>
			{!user && (
				<button className="log" onClick={handleLogin}>
					Iniciar sesión
				</button>
			)}
			{user && (
				<button className="reg" onClick={handleLogout}>
					Cerrar sesión
				</button>
			)}
		</>
	);
}

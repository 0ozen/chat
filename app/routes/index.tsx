import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { createSupabaseServerClient } from "~/utils/supabase.server";
import {
	MessagesRealTime,
	links as chatStyles,
} from "~/components/MessagesRealTime";

import { Login, links as loginStyles } from "~/components/Login";
import styles from "../styles/main.css";
import { useRef, useState } from "react";
import image from "../../public/user.svg"

// loader de datos en el SERVER
export const loader = async ({ request }: LoaderArgs) => {
	const response = new Response();
	const supabase = createSupabaseServerClient({ request, response });
	const { data } = await supabase.from("messages").select();
	return json({ messages: data ?? [] }, { headers: response.headers });
};

export const action = async ({ request }: ActionArgs) => {
	const response = new Response();
	const supabase = createSupabaseServerClient({ request, response });
	const formdata = await request.formData();
	const { message } = Object.fromEntries(formdata);


	const send = await supabase
		.from("messages")
		.insert({ content: String(message) });

	return json({ messages: "ok" }, { headers: response.headers });
};

export const links: LinksFunction = () => [
	...loginStyles(),
	...chatStyles(),
	{ rel: "stylesheet", href: styles },
];

export default function Index() {
	const { messages } = useLoaderData<typeof loader>();
	const { user } = useOutletContext<any>();
	const [show, setShow] = useState(false);
	const resize = useRef<any>();


  function adjustHeight() {
    resize.current.style.height = "25px";
    resize.current.style.height = resize.current.scrollHeight + "px";
  }

	return (
		<main>
			<h1>realtime chat</h1>
			<div className="login">
				<Login />
			</div>

			<MessagesRealTime serverMessages={messages} />

			<div className="form">
				<div>
					<img
						width={"48px"}
						height={"48px"}
						src={user?.user_metadata?.avatar_url || image }
						alt="user avatar"
					/>
				</div>
				<Form method="post">
					<textarea
            ref={resize}
            onChange={adjustHeight}
						onFocus={() => setShow(true)}
						name="message"
						placeholder="Add a comment..."></textarea>
					{show && (
						<div className="buttons">
							<button onClick={() => setShow(false)}>Cancelar</button>
							<button type="submit">Enviar</button>
						</div>
					)}
				</Form>
			</div>
		</main>
	);
}

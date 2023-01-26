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
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import image from "../../public/user.svg";

import { useSubmit } from "@remix-run/react";

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
	const [input, setInput] = useState("");
	const resize = useRef<any>();
	const formRef = useRef<HTMLFormElement>(null);
	const submit = useSubmit();

	function adjustHeight(e: ChangeEvent<HTMLTextAreaElement>) {
		setInput(e?.target?.value);
		resize.current.style.height = "25px";
		resize.current.style.height = resize.current.scrollHeight + "px";
	}

	const cancel = () => {
		setShow(false);
		setInput("");
		resize.current.blur();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		setShow(false);
		setInput("");
		submit(e.currentTarget, { replace: true });
	};

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
						width={"40px"}
						height={"40px"}
						src={user?.user_metadata?.avatar_url || image}
						alt="user avatar"
					/>
				</div>
				<Form onSubmit={handleSubmit} ref={formRef} method="post">
					<textarea
						ref={resize}
						onChange={adjustHeight}
						onFocus={() => setShow(true)}
						name="message"
						placeholder="Add a comment..."
						value={input}
					/>
					{show && (
						<div className="buttons">
							<button onClick={cancel}>Cancelar</button>
							<button type="submit">Enviar</button>
						</div>
					)}
				</Form>
			</div>
		</main>
	);
}

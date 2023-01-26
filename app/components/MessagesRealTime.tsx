import { useSupabase } from "~/hooks/useSupabase";
import { Database } from "~/types/database";
import { useState, useEffect, useRef } from "react";
import { LinksFunction } from "@remix-run/react/dist/routeModules";

import styles from "~/styles/chat.css";
import { useOutletContext } from "@remix-run/react";
import moment from "moment";
import image from "../../public/user.svg"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type Message = Database["public"]["Tables"]["messages"]["Row"];

export function MessagesRealTime({
	serverMessages,
}: {
	serverMessages: Message[];
}) {
	const [messages, setMessages] = useState<Message[]>(serverMessages);
	const supabase = useSupabase();
	const refDiv = useRef<any>();
	const { user } = useOutletContext<any>();

	useEffect(() => {
		setMessages(serverMessages);
	}, [serverMessages]);

	useEffect(() => {
		const chanel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "messages" },
				(payload) => {
					const newMessages = payload.new as Message;
					if (!messages.some((message) => message.id === newMessages.id)) {
						setMessages((messages) => [...messages, newMessages]);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(chanel);
		};
	}, [supabase, messages, setMessages]);

	useEffect(() => {
		refDiv.current.scrollTop = refDiv.current.scrollHeight;
	}, [messages]);

	return (
		<div ref={refDiv} className="messageCont">
			{messages.map(({ content, created_at }) => {
				return (
					<div className="comment">
						<img
							width={"40px"}
							height={"40px"}
							src={image}
							alt="user avatar"
						/>
						<div className="message">
              <div className="messageTop">
							{<p className="userName">{"unknow"}</p>}
              {/* user?.user_metadata?.name ||  */}
              <span>{moment(created_at).fromNow()}</span>
              </div>
							<p className="content">{content}</p>
						</div>{" "}
					</div>
				);
			})}
		</div>
	);
}

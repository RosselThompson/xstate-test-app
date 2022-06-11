import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Button,
	Heading,
	Input,
	Stack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

interface formStateSchema {
	states: {
		Editing: {
			states: {
				Pristine: {};
				Error: {};
			};
		};
		Submitting: {};
		Success: {};
	};
}

type formEvent = { type: "CHANGE" } | { type: "SUBMIT" };

interface formContext {
	values: {
		name: string;
		companyName: string;
		email: string;
	};
	errors: {
		name: string;
		companyName: string;
		email: string;
	};
}

const formMachine = Machine<formContext, formStateSchema, formEvent>(
	{
		key: "Form",
		initial: "Editing",
		context: {
			values: {
				name: "",
				companyName: "",
				email: "",
			},
			errors: {
				name: "",
				companyName: "",
				email: "",
			},
		},
		states: {
			Editing: {
				initial: "Pristine",
				states: {
					Pristine: {},
					Error: {},
				},
				on: {
					CHANGE: {
						target: "",
						actions: ["onChange"],
					},
					SUBMIT: "Submitting",
				},
			},
			Submitting: {
				invoke: {
					src: "saveData",
					onDone: "Success",
					onError: {
						target: "Editing.Error",
						actions: ["onError"],
					},
				},
			},
			Success: {
				type: "final",
			},
		},
	},
	{
		actions: {
			onChange: assign({
				values: (ctx, e: any) => ({
					...ctx.values,
					[e.key]: e.value,
				}),
			}),
			onError: assign({
				errors: (_, e: any) => e.data
			}),
		},
	}
);

const saveData = async ({ values }: { values: any }) => {
	await new Promise((r) => setTimeout(r, 1000));
	const errors = {
		name: "",
		companyName: "",
		email: "",
	};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.companyName) {
		errors.companyName = "Company Name is required";
	}
	if (!values.email) {
		errors.email = "Email is required";
	}

	if (errors.name !== "" || errors.companyName !== "" || errors.email !== "") {
		return Promise.reject(errors);
	}
	console.log(values);
	return Promise.resolve();
};

const App: React.FC = () => {
	const [state, send] = useMachine(formMachine, { services: { saveData } });
	const { values, errors } = state.context;

	const onChange = (event: any) => {
		send("CHANGE", { key: event.target.name, value: event.target.value });
	};

	const onSubmit = () => {
		send("SUBMIT");
	};

	return (
		<div style={{ marginLeft: "30%", marginRight: "30%", marginTop: "20px" }}>
			<div style={{ textAlign: "center" }}>
				<Heading as='h4' mb='5px'>
					Onboarding Process
				</Heading>
				<Heading fontSize='sm' textColor='gray' mb='20px'>
					Please fill all the data
				</Heading>
			</div>
			{state.matches("Success") ? (
				<>
					<Heading fontSize='md'>You're onboarded</Heading>
					<CheckIcon fontSize='30px' />
				</>
			) : (
				<>
					<Stack spacing={3}>
						<FormControl isInvalid={errors.name !== ""}>
							<FormLabel>Name</FormLabel>
							<Input
								name='name'
								variant='filled'
								type='text'
								value={values.name}
								onChange={onChange}
							/>
							<FormErrorMessage>{errors.name}</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors.companyName !== ""}>
							<FormLabel>Company Name</FormLabel>
							<Input
								name='companyName'
								variant='filled'
								type='text'
								value={values.companyName}
								onChange={onChange}
							/>
							<FormErrorMessage>{errors.companyName}</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors.email !== ""}>
							<FormLabel>Email</FormLabel>
							<Input
								name='email'
								variant='filled'
								type='text'
								value={values.email}
								onChange={onChange}
							/>
							<FormErrorMessage>{errors.email}</FormErrorMessage>
						</FormControl>
					</Stack>
					<Button
						colorScheme='facebook'
						size='md'
						mt='30px'
						isLoading={state.matches("Submitting")}
						disabled={state.matches("Submitting")}
						onClick={onSubmit}
					>
						Submit
					</Button>
				</>
			)}
		</div>
	);
};

export default App;

import React, { useState } from "react";
import {
	Box,
	InputGroup,
	InputLeftElement,
	Input,
	InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

export const SearchInput = () => {
	const [value, setValue] = useState<string>("");

    const clear = () => setValue('');

	return (
		<Box w='40%' pt='10' pl='10'>
			<InputGroup>
				<InputLeftElement children={<SearchIcon color='gray.400' />} />
				{value !== "" ? (
					<InputRightElement
						children={
							<CloseIcon
								cursor='pointer'
								color='gray.400'
								fontSize='13px'
								onClick={clear}
							/>
						}
					/>
				) : null}
				<Input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder='Search and add services'
				/>
			</InputGroup>
		</Box>
	);
};

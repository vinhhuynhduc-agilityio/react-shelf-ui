import { render, screen } from "@testing-library/react";
import { useForm, FieldErrors } from "react-hook-form";
import PhoneNumberField from ".";
import { AccountFormValues } from "@/types";

describe("PhoneNumberField", () => {
	const setup = (
		props?: Partial<{
			isEditing: boolean;
			errors: FieldErrors<AccountFormValues>;
			defaultValues: Partial<AccountFormValues>;
		}>
	) => {
		const Wrapper = () => {
			const {
				register,
				formState: { errors },
			} = useForm<AccountFormValues>({
				defaultValues: props?.defaultValues || {
					countryCode: "84",
					phoneNumber: "1234567",
				},
				mode: "onChange",
			});
			return (
				<PhoneNumberField
					register={register}
					errors={props?.errors || errors}
					isEditing={props?.isEditing ?? true}
				/>
			);
		};
		return render(<Wrapper />);
	};

	it("renders label, country code, phone number inputs", () => {
		setup();
		expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/phone number/i)).toHaveAttribute(
			"id",
			"countryCode"
		);
		expect(
			screen.getByPlaceholderText("Your Phone Number")
		).toBeInTheDocument();
	});

	it("disables inputs when isEditing is false", () => {
		setup({ isEditing: false });
		expect(screen.getByLabelText(/phone number/i)).toBeDisabled();
		expect(screen.getByPlaceholderText("Your Phone Number")).toBeDisabled();
	});

	it("shows country code error message", () => {
		const errors = {
			countryCode: { message: "Country code error" },
		} as FieldErrors<AccountFormValues>;
		setup({ errors });
		expect(screen.getByText("Country code error")).toBeInTheDocument();
	});

	it("shows phone number error message", () => {
		const errors = {
			phoneNumber: { message: "Phone number error" },
		} as FieldErrors<AccountFormValues>;
		setup({ errors });
		expect(screen.getByText("Phone number error")).toBeInTheDocument();
	});

	it("matches snapshot (editing)", () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot (not editing)", () => {
		const { container } = setup({ isEditing: false });
		expect(container).toMatchSnapshot();
	});
});

import { gql, useMutation, useQuery } from '@apollo/client';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Group,
	Input,
	NumberInput,
	Paper,
	Select,
	Space,
	Stepper,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import './App.css';

function App() {
	const [captchaToken, setCaptchaToken] = useState<string>();

	// form initiate here
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
		getValues,
	} = useForm<Money_Receipt_Form_Type>({
		defaultValues: {
			deliveryDate: new Date(),
			issueDate: new Date(),
		},
		resolver: yupResolver(Money_Receipt_Form_Schema),
		mode: 'onChange',
	});

	// get services
	const { data: SERVICE__DATA, loading: services__fetching } = useQuery(
		gql`
			query {
				services(input: { page: 1, limit: 1000 }) {
					nodes {
						_id
						title
					}
				}
			}
		`
	);

	const [createReceipt, { loading }] = useMutation(
		gql`
			mutation Create_Receipt($input: CreateMoneyReceiptInput!) {
				createMoneyReceipt(input: $input) {
					_id
				}
			}
		`
	);

	// handle submit form
	const submitForm = (values: Money_Receipt_Form_Type) => {
		// console.log(values);
		createReceipt({
			variables: {
				input: {
					...values,
					authorizeBy: '647d5fd7cd59bc5158a3db95',
					mrNo: 11111,
					serialNo: 1111,
				},
			},
		});
	};

	const [active, setActive] = useState(0);
	const nextStep = () =>
		setActive((current) => (current < 3 ? current + 1 : current));
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	const checkPermissions = () => {
		if (active === 0) {
			if (watch('clientName') && watch('passportNo') && watch('service')) {
				return false;
			} else {
				return true;
			}
		} else if (active === 1) {
			if (
				watch('amountInNumber') &&
				watch('amountInWords') &&
				watch('quantity')
			) {
				return false;
			} else {
				return true;
			}
		} else if (active === 2) {
			if (watch('paymentType') && watch('deliveryDate') && watch('issueDate')) {
				return false;
			} else {
				return true;
			}
		}
	};
	return (
		<Paper p={20} shadow='lg' w={800}>
			<>
				<form onSubmit={handleSubmit(submitForm)}>
					<Stepper
						active={active}
						onStepClick={setActive}
						allowNextStepsSelect={false}
					>
						{/* step 01 */}
						<Stepper.Step label='First step' description='Create an account'>
							<Input.Wrapper
								size='md'
								label='Client name'
								error={<ErrorMessage errors={errors} name='clientName' />}
							>
								<Input
									{...register('clientName')}
									placeholder='Mehedi H. Rafiz'
								/>
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Passport no'
								error={<ErrorMessage errors={errors} name='passportNo' />}
							>
								<Input {...register('passportNo')} placeholder='A10*********' />
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Select service'
								error={<ErrorMessage errors={errors} name='service' />}
							>
								<Select
									data={getSelectInputData(SERVICE__DATA?.services?.nodes)}
									placeholder='Visa Processing'
									disabled={services__fetching}
									value={watch('service')}
									onChange={(e) => setValue('service', e as string)}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />{' '}
						</Stepper.Step>

						{/* step 02 */}
						<Stepper.Step label='Second step' description='Verify email'>
							<Input.Wrapper
								size='md'
								label='Quantity'
								error={<ErrorMessage errors={errors} name='quantity' />}
							>
								<NumberInput
									min={1}
									placeholder='1'
									value={watch('quantity')}
									onChange={(e) => setValue('quantity', parseInt(e as string))}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Amount In Number'
								error={<ErrorMessage errors={errors} name='amountInNumber' />}
							>
								<NumberInput
									min={1}
									placeholder='5050'
									value={watch('amountInNumber')}
									onChange={(e) =>
										setValue('amountInNumber', parseInt(e as string))
									}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Amount In Words'
								error={<ErrorMessage errors={errors} name='amountInWords' />}
							>
								<Input
									{...register('amountInWords')}
									placeholder='Five Thousand Fifty Taka'
								/>
							</Input.Wrapper>
							<Space h={'sm'} />{' '}
						</Stepper.Step>

						{/* step 03 */}
						<Stepper.Step label='Final step' description='Get full access'>
							<Input.Wrapper
								size='md'
								label='Payment Type'
								error={<ErrorMessage errors={errors} name='paymentType' />}
							>
								<Select
									data={['ONLINE', 'BANK', 'NONE', 'NAGAD', 'ROCKET']}
									placeholder='Online'
									onChange={(e) => setValue('paymentType', e!)}
									value={watch('paymentType')}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Issue Date'
								error={<ErrorMessage errors={errors} name='issueDate' />}
							>
								<DateInput
									placeholder='Pick a Date'
									onChange={(e) => setValue('issueDate', e!)}
									defaultValue={watch(`issueDate`) as any}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />
							<Input.Wrapper
								size='md'
								label='Delivery Date'
								error={<ErrorMessage errors={errors} name='deliveryDate' />}
							>
								<DateInput
									placeholder='Pick a Date'
									defaultValue={watch(`deliveryDate`) as any}
									onChange={(date) => setValue(`deliveryDate`, date!)}
								/>
							</Input.Wrapper>
							<Space h={'sm'} />{' '}
						</Stepper.Step>

						{/* step 04 */}
						<Stepper.Completed>
							<pre>{JSON.stringify(getValues(), null, 2)}</pre>

							<Space h={'md'} />

							<HCaptcha
								sitekey='9b75a67a-27d7-4f15-8bae-ea1f180d3278'
								onVerify={(token) => {
									console.log({ token });
									setCaptchaToken(token);
								}}
							/>
						</Stepper.Completed>
					</Stepper>
					{/* submit && control  */}
					<Group justify='center'>
						{active > 0 && (
							<Button variant='default' onClick={prevStep}>
								Back
							</Button>
						)}
						{active !== 3 && (
							<Button disabled={checkPermissions()} onClick={nextStep}>
								Continue{' '}
							</Button>
						)}{' '}
						{active === 3 && (
							<Button type='submit' disabled={!captchaToken} loading={loading}>
								Save
							</Button>
						)}
					</Group>
				</form>
			</>
		</Paper>
	);
}

export default App;

export const Money_Receipt_Form_Schema = Yup.object().shape({
	clientName: Yup.string().required().label('Client name'),
	passportNo: Yup.string().required().label('Passport no'),
	paymentType: Yup.string().required().label('Payment type'),
	service: Yup.string().required().label('Service'),
	amountInWords: Yup.string().required().label('Amount'),
	amountInNumber: Yup.number().required().label('Amount'),
	quantity: Yup.number().required().label('Quantity'),
	issueDate: Yup.date().required().label('Issue date'),
	deliveryDate: Yup.date().required().label('Delivery date'),
});

export type Money_Receipt_Form_Type = Yup.InferType<
	typeof Money_Receipt_Form_Schema
>;

export const getSelectInputData = (input: any) => {
	const dataArray: any = [];

	input?.map((value: any) =>
		dataArray.push({
			label: value?.title,
			value: value?._id,
		})
	);

	return dataArray;
};

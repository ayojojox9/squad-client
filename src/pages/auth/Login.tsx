import React, {useContext, useEffect} from "react";
import Button from "../../components/inline/Button";
import AppContext from "../../providers/AppContext";
import Line from "../../services/input-types/line";
import FormContext, {createFormContext} from "../../providers/FormContext";
import useForm from "../../hooks/useForm";
import {useFormControls} from "../../hooks/useFormControls";
import {useLogin} from "../../services/api/auth";
import {TextValidation} from "squad-shared";

interface ILoginForm {
  email: string;
}

const LoginPage = () => {
  const {
    auth: { setAuthToken },
    nav: { navigate },
    notif: { addNotice, handleUnexpected, removeNotice }
  } = useContext(AppContext);

  const { validate } = useForm<ILoginForm>()
  const { FormInput } = useFormControls<ILoginForm>()

  const [mutLogin, { data, error, loading } ] = useLogin();

  useEffect(() => {
    handleUnexpected(error)
  }, [error]);

  useEffect(() => {
    if(data?.login?.success) {
      setAuthToken(data.login.result);
      navigate('/awaiting-access');
    }
  }, [data])

  const clickedLogin = () => {
    removeNotice('RegisterPageError')
    const [isValid, variables] = validate();
    if(isValid) return mutLogin({ variables })

    addNotice({
      id: 'RegisterPageError',
      message: 'Unable to login, please fix errors',
      level: 'error'
    });
  }

  return (
    <main className="flex flex-col h-full justify-center">
      <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
        <h1>
          Welcome!
          { loading && (<i className="fa-solid fa-yin-yang fa-spin ml-3" />)}
        </h1>
  
        <FormInput
          type={Line}
          label={"Email:"}
          field={"email"}
          // @ts-ignore
          placeholder={"Enter email"}
          className={"w-full"}
          validator={() => [
            [TextValidation.defined, 'Must enter an email'],
            [TextValidation.greaterThan(3), 'Email must be greater than 3 characters']
          ]}
          data-cy={'email'}
        />
  
        <div>
          <Button
            variant={"submit"}
            loading={loading}
            className="w-full"
            onClick={clickedLogin}
            data-cy={'submit'}
          >
            Login
          </Button>
          <div className="text-xs text-hint mt-2">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </main>
  )
}

export const Login = () => (
  <FormContext.Provider value={createFormContext<ILoginForm>({
    email: ''
  })}>
    <LoginPage />
  </FormContext.Provider>
)

export default Login;

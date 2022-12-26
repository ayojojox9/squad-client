import {InputDescriptor} from "./index";
import {TextValidation} from "squad-shared";
import Input, {InputProps} from "../../components/inline/Input";
import $c from "classnames";

const Multiline: InputDescriptor<string> = {
  id: 'multiline',
  input: (props: InputProps<'textarea'>) => (
    <Input
      {...props}
      type={'textarea'}
      className={$c(props.className, 'p-2')}
      onChange={props.onChange}
    />
  ),
  ist: TextValidation.ist
};

export default Multiline;

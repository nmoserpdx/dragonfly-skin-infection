import { Button as SemanticUIButton } from "semantic-ui-react";

const Button = (props) => {
    return <SemanticUIButton className="!text-[1.35vw] !py-0 !px-[1.5625vw] !h-[2.4414vw] !rounded-[9999px] !min-w-[11.7187vw]" {...props}>
        {props.children}
    </SemanticUIButton>
}

export default Button
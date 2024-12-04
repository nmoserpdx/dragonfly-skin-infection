import { memo } from "react";
import { Dropdown, Menu } from 'semantic-ui-react';
// import Logo from "../../assets/vidimg.svg"

const Header = () => {
    return (
        <div className="header-top w-full fixed top-0 h-min-content">
            <Menu attached='top'>
                {/* <div className="logo"><img className="logo-img" src={Logo} /> </div> */}

                <Menu.Menu position='right'>
                    <Dropdown className="item-pd" item icon={<button style={{backgroundColor: "rgba(36,179,75,1)", borderRadius: "9999px", fontSize: "1.1718vw", width: "2.4414vw", height: "2.4414vw", color: "white", lineHeight: "1.4648vw", fontWeight: "600"}}>NR</button>}>
                        <Dropdown.Menu>
                            <Dropdown.Item>Username</Dropdown.Item>
                            <Dropdown.Item>Change Password</Dropdown.Item>
                            <Dropdown.Item>Logout</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Full screen</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
        </div>
    )
}

export default memo(Header)
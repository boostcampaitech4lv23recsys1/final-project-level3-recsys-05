import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

function Template(props) {
  return (
    <>
      <Header logined={props.logined}/>
      <Content>{props.children}</Content>
      <Footer />
    </>
  );
}

export default Template;

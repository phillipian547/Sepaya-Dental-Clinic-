import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function GeneralLayout({children}) {

  const { data: session, status } = useSession();

  const doSignout = async(event) => {
    event.preventDefault();

    const result = await signOut({redirect: true, callbackUrl: "/login"});

    //console.log(result);
  };

  return (
    <>
      <div className="navigation-container">
        <Container>
          <Row>
            <Col className='navigation-header'>
              
              <h1>
                <Link href='/'>Sepaya Dental Scheduling System</Link>
              </h1>
              { status !== 'authenticated' &&
                <div className="left-header">
                  <Link href="/">Home</Link>
                  <Link href="/reservation">Scheduling</Link>
                  <Link href="/login">Admin/Patient Login</Link>
                </div>
              }
              { status === 'authenticated' &&
                <div className="left-header">
                  <Link href="/">Home</Link>
                  <Link href="#" onClick={doSignout}>Logout</Link>
                </div>
              }
              
            </Col>
          </Row>
        </Container>
      </div>

      <div className="main-container">
        {children}
      </div>

      <div className="footer">
        <Container className='footer-inner'>
          <Row>
            <Col>
              <p>Copyright &copy; Sepaya Dental Scheduling System</p>                 
            </Col>
          </Row>
        </Container>
      </div>


    </>
  )
};
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI

      return (
        <React.Fragment>
          <div className="container">
            <div className="under_main offset-md-3 mt-5">
              <img
                // src={
                //   process.env.PUBLIC_URL +
                //   "/global_assets/images/landing/Security.png"
                // }
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/webimages/undermain.png"
                }
                alt="img"
              ></img>
            </div>
            <div className="text-white text-center d_flex-center mt-4 ">
              <a href="/dashboard" className="btn text-white  bg-primary mx-3">
                <i className="fa-solid fa-house" />
                &nbsp; Home
              </a>{" "}
            </div>
          </div>
        </React.Fragment>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

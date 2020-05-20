import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({isDarkMode, dispatch}) => (
  <Layout>
    <SEO title="Home" />
    <h1 className="">Go Fund Yourself</h1>
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt urna hendrerit metus dignissim fringilla vel eu ipsum. Etiam molestie maximus diam, non iaculis orci. Vestibulum at turpis eget arcu condimentum feugiat. Nam eu mauris ut purus scelerisque mattis. Nullam venenatis magna sed lorem posuere, iaculis gravida lacus porttitor. Fusce facilisis aliquam mauris, vel interdum enim mattis id. Cras ac ullamcorper tortor, eget congue libero. Proin interdum felis id risus porta pulvinar. Nullam neque ipsum, vulputate non commodo at, ultrices ac justo. Vestibulum eget consectetur orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Praesent non molestie arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum quis enim quis nisl maximus malesuada. Nulla vulputate dui vitae sapien sollicitudin placerat. Aliquam sem ipsum, imperdiet sed massa id, accumsan scelerisque odio. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris tempus vehicula neque, a ornare est tempus nec. 
    </p>
    <div className="text-center mb-5">
      <Link to="/user/debt" className="btn btn-primary">Start</Link>
    </div>
  </Layout>
)

export default IndexPage

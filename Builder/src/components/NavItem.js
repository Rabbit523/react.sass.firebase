/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react'
import { Link, IndexLink, withRouter } from 'react-router'

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
class NavItem extends Component {

  render () {

    function resolveToLocation(to, router) {

      return typeof to === 'function' ? to(router.location) : to
    }


    const { router } = this.props
    const { menuPath,index, to, children, ...props } = this.props

    let isActive




    const toLocation = resolveToLocation(to, router)

    /*console.log("toLocation");
    console.log(toLocation);
    console.log("to")
    console.log(to);
    console.log("Is active with is it index"+index);
    console.log(router.isActive(toLocation,index))
    console.log("Is active with no index");
    console.log(router.isActive(to))
    console.log("Here goes the router");
    console.log(router);*/

    var mostObviousCase=router.isActive(toLocation,index);
    var isExternalLink=to.indexOf("http")>-1;

    if(index){
      //Check if path contains /app
      if(router.location.pathname.indexOf('/app')>-1){
        mostObviousCase=true;
      }
    }

    const LinkComponent = index ?  IndexLink : Link

    return (
      <li className={mostObviousCase ? 'active nav-item' : 'nav-item'}>
         <ConditionalDisplay condition={!isExternalLink}>
          <LinkComponent className={"nav-link"}  {...this.props}>{children}</LinkComponent>
         </ConditionalDisplay>
         <ConditionalDisplay condition={isExternalLink}>
          <a href={menuPath}  className={"nav-link"} target={"_blank"} >{children}</a>
         </ConditionalDisplay>
        
      </li>
    )
  }
}

NavItem = withRouter(NavItem)

export default NavItem

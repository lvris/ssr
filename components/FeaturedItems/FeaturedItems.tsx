import React from "react";
import styled from "styled-components";
import {FeaturedItemsHeader} from "@/components/FeaturedItems/FeaturedItemsHeader";
import {FeaturedItemsCards} from "@/components/FeaturedItems/FeaturedItemsCards";
import {FeaturedItemsButton} from "@/components/FeaturedItems/FeaturedItemsButton";

const FeaturedItems = () =>
{
  return (
    <Wrapper className="section">
      <FeaturedItemsHeader />
      <FeaturedItemsCards />
      <FeaturedItemsButton />
    </Wrapper>
  );
}

const Wrapper = styled.section`
  background: var(--clr-grey-10);
  .featured
  {
    margin: 4rem auto;
    display: grid;
    gap: 2.5rem;
    img
    {
      height: 225px;
    }
  }
  .btn
  {
    display: block;
    width: 148px;
    margin: 0 auto;
    text-align: center;
  }
  @media (min-width: 576px)
  {
    .featured
    {
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
  }
`
export default FeaturedItems
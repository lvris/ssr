import React from 'react';
import styled from 'styled-components';
import {formatPrice} from "@/util/helpers";
import {FaSearch} from "react-icons/fa";
import {DemoItem} from "@/interfaces/Demo.interface";

const Item: React.FC<{item: DemoItem }> = ({item}) =>
{
  const {id, name, price} = item;
  const image = `https://picsum.photos/id/${id}/400/300`;

  return (
    <Wrapper>
      <div className='container'>
        <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
        </div>
        <a href="/csr" className="btn">
          <img src={image} alt={name} />
          <div className="link">
            <FaSearch />
          </div>
        </a>
      </div>
      <footer>
        <h5>{name}</h5>
        <p>{formatPrice(price)}</p>
      </footer>
    </Wrapper>
  );
}

const Wrapper = styled.article`
  .container
  {
    position: relative;
    background: var(--clr-black);
    border-radius: var(--radius);
  }
  img
  {
    width: 100%;
    display: block;
    object-fit: cover;
    border-radius: var(--radius);
    transition: var(--transition);
  }
  .link
  {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary-5);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);
    opacity: 0;
    cursor: pointer;
    svg
    {
      font-size: 1.25rem;
      color: var(--clr-white);
    }
  }
  .container:hover img
  {
    opacity: 0.5;
  }
  .container:hover .link
  {
    opacity: 1;
  }
  footer
  {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer h5,
  footer p
  {
    margin-bottom: 0;
    font-weight: 400;
  }

  footer p
  {
    color: var(--clr-primary-5);
    letter-spacing: var(--spacing);
  }
`
export default Item
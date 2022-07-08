import {
  CloseButton,
  Flex,
  Link,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import * as React from "react";
import { CartProductMeta } from "./CartProductMeta";
import { URL_API } from "../../helpers";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const CartItem = (props) => {
  const [data, setData] = useState([]);
  const {
    name,
    product_id,
    category,
    picture,
    price,
    amount,
    stock,
    onClickDelete,
    updateCart,
    setUpdateCart,
  } = props;
  const [currentAmount, setCurentAmount] = useState(amount);

  // console.log(props);

  const { email, username, id: userId } = useSelector((state) => state.user);

  // let userId = 2;

  const increaseQuantity = () => {
    if (currentAmount < stock) {
      setCurentAmount((currentAmount) => currentAmount + 1);
      setUpdateCart(true);
    } else {
      setCurentAmount(stock);
      setUpdateCart(true);
    }
  };

  const decreaseQuantity = () => {
    if (currentAmount > 0) {
      setCurentAmount((currentAmount) => currentAmount - 1);
      setUpdateCart(true);
    }
  };

  const changeQuantity = (event) => {
    if (event.target.value < stock) {
      setCurentAmount(event.target.value);
      setUpdateCart(true);
    } else {
      setCurentAmount(stock);
      setUpdateCart(true);
    }
  };

  useEffect(() => {
    let fetchCart = `${URL_API}/user/cart/${userId}/update/${product_id}`;

    let obj = {
      qty: currentAmount,
    };

    axios
      .patch(fetchCart, obj)
      .then((res) => {
        setData(() => res.data.content);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentAmount, updateCart]);

  return (
    <Flex
      direction={{
        base: "column",
        md: "row",
      }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta
        name={name}
        description={category}
        image={URL_API + picture}
      />

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{
          base: "none",
          md: "flex",
        }}
      >
        {stock ? (
          <NumberInput
            size="sm"
            maxW={20}
            defaultValue={currentAmount}
            min={1}
            max={stock}
          >
            <NumberInputField onChange={changeQuantity} />
            <NumberInputStepper>
              <NumberIncrementStepper
                onClick={currentAmount < stock ? increaseQuantity : null}
              />
              <NumberDecrementStepper
                onClick={currentAmount > 1 ? decreaseQuantity : null}
              />
            </NumberInputStepper>
          </NumberInput>
        ) : (
          <Box>
            <Text
              bg="red.300"
              px={2}
              py={1}
              color="gray.900"
              fontSize="xs"
              fontWeight="600"
              rounded="xl"
            >
              Out of Stock
            </Text>
          </Box>
        )}

        {/* <PriceTag price={price} currency={currency} /> */}
        <Text my="auto" fontWeight="500">
          Rp {price * currentAmount}
        </Text>
        <CloseButton
          aria-label={`Delete ${name} from cart`}
          onClick={onClickDelete}
        />
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{
          base: "flex",
          md: "none",
        }}
      >
        <Button
          fontSize="sm"
          onClick={onClickDelete}
          // backgroundColor="red.300"
          py={1}
          variant="outline"
        >
          Delete
        </Button>
        {stock ? (
          <NumberInput
            size="sm"
            maxW={20}
            defaultValue={currentAmount}
            min={1}
            max={stock}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper
                onClick={currentAmount < stock ? increaseQuantity : null}
              />
              <NumberDecrementStepper
                onClick={currentAmount > 0 ? decreaseQuantity : null}
              />
            </NumberInputStepper>
          </NumberInput>
        ) : (
          <Box>
            <Text
              bg="red.300"
              px={2}
              py={1}
              color="gray.900"
              fontSize="xs"
              fontWeight="600"
              rounded="xl"
            >
              Out of Stock
            </Text>
          </Box>
        )}
        <Text my="auto" fontWeight="500">
          Rp {price * currentAmount}
        </Text>
      </Flex>
    </Flex>
  );
};
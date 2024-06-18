"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { sigInUser } from "@/store/slices/authSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const signin = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      sigInUser({
        formData,
        onSuccess: () => {
          toast({
            title: `Account Login successfully`,
          });
          setFormData({
            email: "",
            password: "",
          });
        },
      })
    );
    console.log(formData);
  };

  const isLoading = false;
  return (
    <div className="sm:w-420 flex-center flex-col">
      <Link href="/" className="flex items-center gap-1 mb-0">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="My Stack"
        />

        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 ml-1">
          My <span className="text-primary-500">Stack</span>
        </p>
      </Link>
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-5 text-white">
        Login to you Account
      </h2>
      <p className="text-light-3 small-medium md:base-regular text-white">
        Welcome back, Please enter your details
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
        <div>
          <label
            htmlFor="email"
            className="mb-3 block text-base small-medium text-white"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="shad-input text-white"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-3 block text-base small-medium text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            className="shad-input text-white"
            autoComplete="off"
          />
        </div>
        <Button type="submit" className="shad-button_primary">
          {isLoading ? (
            <div className="flex-center gap-2">Loading...</div>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2 text-white">
          Don't have an account?
          <Link
            href="/sign-up"
            className="text-primary-500 text-small-semibold ml-1"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default signin;

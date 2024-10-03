import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import userService, { User } from "../../services/user/user-service";
import axios, { CanceledError } from "axios";
import { useState } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Generateur from "../generateur/generateur";

const schema = z
  .object({
    username: z.string().min(3, {
      message: "Le nom de viking doit avoir au moins cinq charactères.",
    }),
    last_name: z
      .string()
      .min(2, { message: "Le nom doit avoir au moins deux charactères." }),
    first_name: z
      .string()
      .min(2, { message: "Le prénom doit avoir au moins deux charactères." }),
    sexe: z.string(),
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().min(6, {
      message: "Le mot de passe doit avoir au moins six caractères.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Le mot de passe doit avoir au moins six caractères.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Petit viking s'est trompé de mot de passe",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

const FotoForm = () => {
  const location = useLocation();
  const { titre } = location.state || {};
  const [text, setText] = useState(titre);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const onSubmit = (data: FieldValues) => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    userService
      .add(data)
      .then((res) => {
        alert("Bienvenue dans la drakar viking " + data["username"] + " !");
        navigate("/");
      })
      .catch((err) => setErreur(err.message));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) }); // FormData pour lui dire la forme de l'objet rendu et avoir des propositions

  // Fonction pour gérer les changements dans le champ de saisie
  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="mb-3" style={{ width: "301px" }}>
        <label htmlFor="nom" style={{ color: "white" }}>
          {" "}
          Nom d'utilisateur{" "}
        </label>
        <input
          {...register("username")}
          id="username"
          type="text"
          className="form-control"
          value={text} // apres le generateur de nom
          onChange={handleChange}
        ></input>{" "}
        <a onClick={() => navigate("/Generateur")}>
          Pas d'inspi? Utilise le generateur ikae!
        </a>
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
        )}{" "}
        <br />
        <label htmlFor="first-name" style={{ color: "white" }}>
          {" "}
          Nom{" "}
        </label>
        <input
          {...register("first_name")}
          id="name"
          type="text"
          className="form-control"
        ></input>
        {errors.first_name && (
          <p className="text-danger">{errors.first_name.message}</p>
        )}
        <label htmlFor="last_name" style={{ color: "white" }}>
          {" "}
          Prénom{" "}
        </label>
        <input
          {...register("last_name")}
          id="prenom"
          type="text"
          className="form-control"
        ></input>
        {errors.last_name && (
          <p className="text-danger">{errors.last_name.message}</p>
        )}
        <label htmlFor="sexe" style={{ color: "white" }}>
          {" "}
          Sexe{" "}
        </label>
        <select {...register("sexe")} name="sexe" className="form-control">
          <option value="H">Homme</option>
          <option value="F">Femme</option>
        </select>
        <label htmlFor="mail" style={{ color: "white" }}>
          {" "}
          Mail{" "}
        </label>
        <input
          {...register("email")}
          id="mail"
          type="mail"
          className="form-control"
        ></input>
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
        <label htmlFor="password" style={{ color: "white" }}>
          {" "}
          Mot de passe{" "}
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className="form-control"
        ></input>
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
        <label htmlFor="confirmPassword" style={{ color: "white" }}>
          {" "}
          Confirmer le mot de passe{" "}
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          className="form-control"
        ></input>
        {errors.confirmPassword && (
          <p className="text-danger">{errors.confirmPassword.message}</p>
        )}
        <br />
        <button className="form-control">Valider</button>
        <p style={{ color: "white" }}>
          {erreur && "Ce nom d'utilisateur ou cet email existe déjà"}
        </p>
      </div>
    </form>
  );
};

export default FotoForm;

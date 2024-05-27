import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import userService from "../../services/user-service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z
    .string()
    .min(5, { message: "Veuillez entrer un nom d'utilisateur valide." }),
  password: z.string().min(6, {
    message: "Le mot de passe doit avoir au moins six caractères.",
  }),
});

type FormData = z.infer<typeof schema>;

const FotoForm = () => {
  const navigate = useNavigate();
  const [erreur, setErreur] = useState("");

  const onSubmit = (data: FieldValues) => {
    userService
      .connect(data)
      .then((res) => {
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("access", res.data.access);
        console.log(res.data.access);
        navigate("/images");
      })
      .catch((err) => setErreur(err.message));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) }); // FormData pour lui dire la forme de l'objet rendu et avoir des propositions

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
      <div className="mb-3">
        <label htmlFor="mail"> Nom d'utilisateur </label>
        <input
          {...register("username")}
          id="mail"
          type="mail"
          className="form-control"
        ></input>
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
        )}

        <label htmlFor="password"> Mot de passe </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className="form-control"
        ></input>
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}

        <button disabled={!isValid} className="form-control">
          Valider
        </button>
        {erreur && (
          <p className="text-danger">
            Mot de passe ou nom d'utilisateur invalide
          </p>
        )}
      </div>
    </form>
  );
};

export default FotoForm;

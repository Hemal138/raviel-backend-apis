import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import { ApiResponse } from "../common/utils";
import partnerService from "../services/partner.service";

const partnerController = {
  partnerAddSellersViaForm: {
    validation: validator({
      body: Joi.object({
        sellerId: Joi.string().required(),
        sellerName: Joi.string().required(),
        brandName: Joi.string().required(),
        launchingDate: Joi.string().required(),
        listingDate: Joi.string().required(),
        sellerEmailId: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required(),
        brandApproval: Joi.string().valid("pending", "approved").required(),
        gstNumber: Joi.string().required(),
        trademarkClass: Joi.string().valid("pending", "approved").required(),
        productCategories: Joi.array().items(Joi.string()).min(1).required()
      })
    }),
    handler: async (req: any, res: Response) => {
      const addedsellerByPartner = await partnerService.partnerAddSellersViaForm(req);
      if (!addedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (addedsellerByPartner === message.SELLER_ALREADY_EXIST)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_ALREADY_EXIST,
        });
      return ApiResponse.CREATED({
        res,
        message: "Seller added by partner successfully",
        payload: {},
      });
    },
  },

  updateSellerAddedByPartner: {
    validation: validator({
      body: Joi.object({
        sellerName: Joi.string(),
        brandName: Joi.string(),
        launchingDate: Joi.string(),
        listingDate: Joi.string(),
        sellerEmailId: Joi.string(),
        phoneNumber: Joi.string(),
        password: Joi.string(),
        brandApproval: Joi.string().valid("pending", "approved"),
        gstNumber: Joi.string(),
        trademarkClass: Joi.string().valid("pending", "approved"),
        totalSKUs: Joi.number(),
        pendingSKUs: Joi.number(),
        liveSKUs: Joi.number(),
      }),
      params: Joi.object({
        sellerId: Joi.string().required()
      })
    }),
    handler: async (req: any, res: Response) => {
      const updatedsellerByPartner = await partnerService.updateSellerAddedByPartner(req);
      if (!updatedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (updatedsellerByPartner === message.SELLER_NOT_FOUND)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "Seller updated successfully",
        payload: {},
      });
    },
  },

  deleteSellerAddedByPartner: {
    validation: validator({
      params: Joi.object({
        sellerId: Joi.string().required()
      })
    }),
    handler: async (req: any, res: Response) => {
      const deletedsellerByPartner = await partnerService.deleteSellerAddedByPartner(req);
      if (!deletedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (deletedsellerByPartner === message.SELLER_NOT_FOUND)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "Seller deleted successfully",
        payload: {},
      });
    },
  },

  fetchSellerAddedByPartner: {
    validation: validator({
      params: Joi.object({
        sellerId: Joi.string().required()
      })
    }),
    handler: async (req: any, res: Response) => {
      const fetchsellerByPartner = await partnerService.fetchSellerAddedByPartner(req);
      if (!fetchsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (fetchsellerByPartner === message.SELLER_NOT_FOUND)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "Seller fetched successfully",
        payload: fetchsellerByPartner,
      });
    },
  },

  fetchAllSellersAddedByPartner: {
    validation: validator({
    }),
    handler: async (req: any, res: Response) => {
      const fetchsellersByPartner = await partnerService.fetchAllSellersAddedByPartner(req);
      return ApiResponse.OK({
        res,
        message: "All sellers fetched successfully",
        payload: fetchsellersByPartner,
      });
    },
  },

  addSellersByPartnerUsingFile: {
    validation: validator({
    }),
    handler: async (req: any, res: Response) => {
      console.log("req.file: ", req.file);
      console.log("req.body: ", req.body);
      const sellersAddedByPartner = await partnerService.addSellersByPartnerUsingFile(req);
      return ApiResponse.OK({
        res,
        message: "All sellers added successfully",
        payload: {},
      });
    },
  },

};

export default partnerController;

import db from "../models/index";
const { Op } = require('sequelize');
const eventController = {
    addEvent: async (req, res) => {
        try {
            if (Object.keys(req.body).length === 0) {
                return res.status(201).json({ message: 'Request body is empty' });
            }
            await db.Event.create({
                des: req.body.des,
                value: req.body.value,
                point: req.body.point,
                status: '0',
            });
            return res.status(200).json({ message: 'sucessfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },



    getEvent: async (req, res) => {
        try {
            const events = await db.Event.findAll();
            return res.status(200).json({
                message: 'Successfully',
                events: events
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    getEventActive: async (req, res) => {
        try {
            const events = await db.Event.findAll({ where: { status: '1' } });
            return res.status(200).json({
                message: 'Successfully',
                events: events
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const event_id = req.params.id;
            const { ...updateData } = req.body;
            await db.Event.update(updateData, { where: { id: event_id } });
            return res.status(200).json({
                message: 'Successfully',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await db.Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({
                    message: 'Event not found'
                });
            }
            await event.destroy();
            return res.status(200).json({
                status: 200,
                message: 'Delete successfully'
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    }
};

module.exports = eventController;
